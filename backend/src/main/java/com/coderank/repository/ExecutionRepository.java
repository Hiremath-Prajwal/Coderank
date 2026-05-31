package com.coderank.repository;

import com.coderank.model.Execution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExecutionRepository extends JpaRepository<Execution, Long> {

    List<Execution> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Execution> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
}
