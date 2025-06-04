package com.example.demo.dto;

public class StoryDTO {
    private Long storyId;
    private String title;
    private String thumbnail;
    private String author;
    private String genre;
    private int likes;

    // 생성자
    public StoryDTO(Long storyId, String title, String thumbnail, String author, String genre, int likes) {
        this.storyId = storyId;
        this.title = title;
        this.thumbnail = thumbnail;
        this.author = author;
        this.genre = genre;
        this.likes = likes;
    }

    // Getter/Setter
    public Long getStoryId() {
        return storyId;
    }

    public void setStoryId(Long storyId) {
        this.storyId = storyId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }
}
