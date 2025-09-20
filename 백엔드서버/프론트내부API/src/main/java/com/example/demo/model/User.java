package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "password")
@Table(name = "User") // 대소문자 주의
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(name = "phone_number")
    private String phoneNumber;

    private String name;
    private String nickname;

    @Column(nullable = false)
    private Integer age;

    @Column(name = "join_date", insertable = false, updatable = false)
    private LocalDateTime joinDate;

    @Column(name = "token_balance")
    private Integer tokenBalance;
}