package org.ai.isserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDTO {

    private String username;
    private String name;
    private String email;
    private String contactNumber;
    private String country;
}
