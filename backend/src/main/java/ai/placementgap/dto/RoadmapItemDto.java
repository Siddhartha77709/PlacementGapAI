package ai.placementgap.dto;

public class RoadmapItemDto {
    private Long id;
    private String title;
    private String category;
    private String detail;
    private boolean done;
    private String resource;
    private Integer order;

    public RoadmapItemDto() {}

    public RoadmapItemDto(Long id, String title, String category, String detail, boolean done, String resource, Integer order) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.detail = detail;
        this.done = done;
        this.resource = resource;
        this.order = order;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public String getResource() {
        return resource;
    }

    public void setResource(String resource) {
        this.resource = resource;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }
}
