package ai.placementgap.controller;

import ai.placementgap.dto.AnalysisRequestDto;
import ai.placementgap.dto.AnalysisResponseDto;
import ai.placementgap.dto.ProfileDto;
import ai.placementgap.service.AnalysisService;
import ai.placementgap.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(originPatterns = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class PlacementGapController {

    private final AnalysisService analysisService;
    private final ProfileService profileService;

    public PlacementGapController(AnalysisService analysisService, ProfileService profileService) {
        this.analysisService = analysisService;
        this.profileService = profileService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResponseDto> analyze(@Valid @RequestBody AnalysisRequestDto request) {
        AnalysisResponseDto response = analysisService.analyze(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/roadmap")
    public ResponseEntity<AnalysisResponseDto> roadmap() {
        return ResponseEntity.ok(analysisService.progress());
    }

    @GetMapping("/progress")
    public ResponseEntity<AnalysisResponseDto> progress() {
        return ResponseEntity.ok(analysisService.progress());
    }

    @PostMapping("/progress/{id}/complete")
    public ResponseEntity<AnalysisResponseDto> complete(@PathVariable("id") Long id) {
        return ResponseEntity.ok(analysisService.complete(id));
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileDto> getProfile() {
        return ResponseEntity.ok(profileService.getProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileDto> updateProfile(@RequestBody ProfileDto profileDto) {
        return ResponseEntity.ok(profileService.saveOrUpdateProfile(profileDto));
    }

    @PostMapping("/profile")
    public ResponseEntity<ProfileDto> saveProfile(@RequestBody ProfileDto profileDto) {
        return ResponseEntity.ok(profileService.saveOrUpdateProfile(profileDto));
    }
}
