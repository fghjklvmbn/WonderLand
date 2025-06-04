// package com.example.demo.model;
// import jakarta.persistence.*;
// import lombok.*;
// import java.time.LocalDateTime;
// import com.fasterxml.jackson.annotation.JsonIgnore;
// import com.fasterxml.jackson.annotation.JsonProperty;

// @Entity
// @Getter
// @Setter
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder
// @ToString(exclude = "password")
// public class User {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long userId;

//     @Column(nullable = false, unique = true)
//     private String email;
    
//     @Column(nullable = false)
//     @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)


//     @Id
//     private Long id;
//     private String username;
//     private String password;

//     private String name;
//     private String nickname;
//     private Integer age;

//     @Builder.Default
//     private LocalDateTime joinDate = LocalDateTime.now();

//     @Builder.Default
//     private Integer tokenBalance = 10;
// }

package com.example.demo.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

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
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @JsonProperty("phone_number")
    private String phoneNumber;
    private String name;
    private String nickname;
    private Integer age;

    @Builder.Default
    private LocalDateTime joinDate = LocalDateTime.now();

    @Builder.Default
    private Integer tokenBalance = 10;
}
