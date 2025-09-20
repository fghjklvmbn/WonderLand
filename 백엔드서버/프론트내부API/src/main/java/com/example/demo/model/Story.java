package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Story")
public class Story {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "story_id", nullable = false)
    private Long storyId; // PK 이름을 통일

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(length = 200)
    private String title;

    @Column(length = 50)
    private String genre;

    @Column(name = "text_json", columnDefinition = "json")
    private String textJson;

    @Column(name = "selected_json", columnDefinition = "json")
    private String selectedJson;

    @Column(name = "is_draft")
    private Boolean isDraft = true;

    @Column(name = "is_shared")
    private Boolean isShared = false;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}