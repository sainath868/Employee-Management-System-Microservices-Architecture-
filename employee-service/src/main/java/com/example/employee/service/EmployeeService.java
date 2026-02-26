package com.example.employee.service;

import com.example.employee.entity.Employee;
import com.example.employee.exception.ResourceNotFoundException;
import com.example.employee.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;
    private final FileStorageService fileStorageService;

    public EmployeeService(EmployeeRepository repository, FileStorageService fileStorageService) {
        this.repository = repository;
        this.fileStorageService = fileStorageService;
    }

    public Employee save(Employee employee) {
        return repository.save(employee);
    }

    public List<Employee> findAll() {
        return repository.findAll();
    }

    public Employee findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
    }

    public void delete(Long id) throws IOException {
        Employee employee = findById(id);
        fileStorageService.deleteIfExists(employee.getPhotoPath());
        repository.delete(employee);
    }

    public Employee uploadPhoto(Long id, MultipartFile file) throws IOException {
        Employee employee = findById(id);
        fileStorageService.deleteIfExists(employee.getPhotoPath());
        String fileName = fileStorageService.store(file);
        employee.setPhotoPath(fileName);
        return repository.save(employee);
    }
}
