// package com.example.demo.dto; // 실제 패키지명으로 수정


// import lombok.Getter;
// import lombok.Setter;


// public class LoginRequest {
//     private String email;
//     private String user_id;
//     private String user_password;

//     // 기본 생성자
//     public LoginRequest() {
//     }

//     // 생성자
//     public LoginRequest(String user_id, String user_password) {
//         this.user_id = user_id;
//         this.user_password = user_password;
//     }

//     // Getter
//     public String getUserId() {
//         return user_id;
//     }

//     public String getPassword() {
//         return user_password;
//     }

//     // Setter
//     public void setUserId(String user_id) {
//         this.user_id = user_id;
//     }

//     public void setUserPassword(String user_password) {
//         this.user_password = user_password;
//     }
//     public String getEmail() {
//     return email;
//     }

//     public void setEmail(String email) {
//         this.email = email;
//     }
// }

package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LoginRequest {
    private String email;
    private String password;
}