package ai.placementgap.service;

import ai.placementgap.dto.ProfileDto;
import ai.placementgap.model.CandidateProfile;
import ai.placementgap.repository.CandidateProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
public class ProfileService {

    private final CandidateProfileRepository profileRepository;

    public ProfileService(CandidateProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public ProfileDto getProfile() {
        Optional<CandidateProfile> profileOpt = profileRepository.findFirstByOrderByIdDesc();
        if (profileOpt.isEmpty()) {
            ProfileDto emptyDto = new ProfileDto();
            emptyDto.setFullName("Candidate");
            emptyDto.setSkills("Java, React, SQL, Git");
            emptyDto.setTargetRole("Software Engineer");
            emptyDto.setResumeText("");
            emptyDto.setProjectsText("");
            return emptyDto;
        }

        CandidateProfile profile = profileOpt.get();
        ProfileDto dto = new ProfileDto();
        dto.setId(profile.getId());
        dto.setFullName(profile.getFullName());
        dto.setEmail(profile.getEmail());
        dto.setTargetRole(profile.getTargetRole());
        dto.setSkills(profile.getSkills());
        dto.setResumeText(profile.getResumeText());
        dto.setProjectsText(profile.getProjectsText());
        dto.setUpdatedAt(profile.getUpdatedAt());
        return dto;
    }

    @Transactional
    public ProfileDto saveOrUpdateProfile(ProfileDto dto) {
        CandidateProfile profile = profileRepository.findFirstByOrderByIdDesc()
                .orElseGet(CandidateProfile::new);

        if (dto.getFullName() != null) profile.setFullName(dto.getFullName().trim());
        if (dto.getEmail() != null) profile.setEmail(dto.getEmail().trim());
        if (dto.getTargetRole() != null) profile.setTargetRole(dto.getTargetRole().trim());
        if (dto.getSkills() != null) profile.setSkills(dto.getSkills().trim());
        if (dto.getResumeText() != null) profile.setResumeText(dto.getResumeText().trim());
        if (dto.getProjectsText() != null) profile.setProjectsText(dto.getProjectsText().trim());
        profile.setUpdatedAt(Instant.now());

        CandidateProfile saved = profileRepository.save(profile);
        dto.setId(saved.getId());
        dto.setUpdatedAt(saved.getUpdatedAt());
        return dto;
    }
}
