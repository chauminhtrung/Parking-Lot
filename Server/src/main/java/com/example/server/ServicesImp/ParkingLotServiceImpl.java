package com.example.server.ServicesImp;


import com.example.server.DTO.Request.ParkingLotRequest;
import com.example.server.DTO.Respone.ParkingLotResponse;
import com.example.server.Mapper.ParkingLotMapper;
import com.example.server.Model.Account;
import com.example.server.Model.ParkingLot;
import com.example.server.Repositories.AccountRepository;
import com.example.server.Repositories.ParkingLotRepository;
import com.example.server.Services.ParkingLotService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingLotServiceImpl implements ParkingLotService {


    private final ParkingLotRepository parkingLotRepository;
    private final ParkingLotMapper parkingLotMapper;
    private final AccountRepository accountRepository;

    @Override
    public ParkingLotResponse create(ParkingLotRequest request) {

        ParkingLot lot = parkingLotMapper.toEntity(request);

        // 🟢 Lấy Account từ accountId trong request
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với ID: " + request.getAccountId()));

        lot.setAccount(account);
        lot.setLotName(request.getLotName());
        lot.setAddress(request.getAddress());
        // 💾 Lưu vào DB
        ParkingLot savedLot = parkingLotRepository.save(lot);

        // 🟣 Tạo response thủ công (không dùng mapper)
        ParkingLotResponse response = new ParkingLotResponse();
        response.setLotId(savedLot.getLotId());
        response.setLotName(savedLot.getLotName());
        response.setAddress(savedLot.getAddress());
        response.setAccountUsername(savedLot.getAccount().getUsername());
        return response;
    }


    @Override
    public ParkingLotResponse update(Integer id, ParkingLotRequest request) {
        ParkingLot lot = parkingLotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bãi đỗ xe"));
        parkingLotMapper.updateEntityFromDto(request, lot);
        return parkingLotMapper.toResponse(parkingLotRepository.save(lot));
    }

    @Override
    public void delete(Integer id) {
        parkingLotRepository.deleteById(id);
    }

    @Override
    public List<ParkingLotResponse> getAll() {
        return parkingLotRepository.findAll().stream()
                .map(parkingLotMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ParkingLotResponse getById(Integer id) {
        return parkingLotRepository.findById(id)
                .map(parkingLotMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bãi đỗ xe"));
    }

    @Override
    public List<ParkingLotResponse> getByAccountId(Integer accountId) {
        List<ParkingLot> lots = parkingLotRepository.findByAccount_AccountId(accountId);

        if (lots.isEmpty()) {
            return Collections.emptyList();
        }
        List<ParkingLotResponse> responses = new ArrayList<>();
        for (ParkingLot lot : lots) {
            ParkingLotResponse res = new ParkingLotResponse();
            res.setLotId(lot.getLotId());
            res.setLotName(lot.getLotName());
            res.setAddress(lot.getAddress());

            // ⚙️ Nếu entity ParkingLot có Account
            if (lot.getAccount() != null) {
                res.setAccountUsername(lot.getAccount().getUsername());
            }
            responses.add(res);
        }

        return responses;
    }





}

