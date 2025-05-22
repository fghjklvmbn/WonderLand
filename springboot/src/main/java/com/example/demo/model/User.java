package com.example.demo.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "password")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    private String name;
    private String nickname;
    private Integer age;

    @Builder.Default
    private LocalDateTime joinDate = LocalDateTime.now();

    @Builder.Default
    private Integer tokenBalance = 10;
}
