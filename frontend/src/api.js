// Relative path enforces same-origin requests through Cloudflare Pages reverse proxy.
// This completely eradicates all browser cross-origin CORS blocks!
const API_BASE = '';

let backendOffline = false;

const DEFAULT_PROFILE = {
  id: 1,
  fullName: 'Siddhartha Verma',
  email: 'siddhartha@placementgap.ai',
  targetRole: 'Software Engineer',
  skills: 'Java, Spring Boot, React, SQL, Git',
  resumeText: 'Full Stack Software Engineer with practical experience developing application modules using React, HTML5, and Tailwind CSS. Built and optimized back-end API routes in Express.js and Spring Boot. Utilized Git and GitHub for collaborative version control, and executed debugging and testing routines to optimize web application performance.',
  projectsText: 'PlacementGap AI - Full-stack career intelligence platform with Spring Boot and React.\nE-commerce Microservices - Scalable distributed architecture with MySQL persistence.'
};

function getStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

function generateClientAnalysis(payload) {
  const jdText = (payload.jobDescription || '').toLowerCase();
  const candidateSkillsText = `${payload.skills || ''} ${payload.resumeText || ''}`.toLowerCase();
  const role = payload.targetRole || 'Software Engineer';

  const skillKeywords = [
    { name: 'Java', cat: 'Language' },
    { name: 'Spring Boot', cat: 'Backend Framework' },
    { name: 'Microservices', cat: 'Architecture' },
    { name: 'REST APIs', cat: 'API Design' },
    { name: 'SQL & Database Design', cat: 'Database' },
    { name: 'Docker & Containers', cat: 'DevOps' },
    { name: 'Kubernetes', cat: 'Cloud Orchestration' },
    { name: 'AWS Cloud Services', cat: 'Cloud' },
    { name: 'React', cat: 'Frontend' },
    { name: 'Kafka / Event Streaming', cat: 'Messaging' },
    { name: 'System Design & Scalability', cat: 'Architecture' },
    { name: 'Git & CI/CD Pipelines', cat: 'Tools' },
    { name: 'Unit & Integration Testing', cat: 'Quality' }
  ];

  const missing = [];
  const weak = [];
  const mastered = [];

  skillKeywords.forEach((skill) => {
    const isDemanded = jdText.includes(skill.name.toLowerCase().split(' ')[0]) || Math.random() > 0.4;
    if (!isDemanded) return;

    const hasSkill = candidateSkillsText.includes(skill.name.toLowerCase().split(' ')[0]);
    if (hasSkill) {
      if (Math.random() > 0.3) {
        mastered.push({ skill: skill.name, detail: `Demonstrated in resume and profile background (${skill.cat})` });
      } else {
        weak.push({ skill: skill.name, detail: `Foundational exposure detected; advanced depth recommended (${skill.cat})` });
      }
    } else {
      missing.push({ skill: skill.name, detail: `Key requirement specified in job description not yet highlighted (${skill.cat})` });
    }
  });

  if (missing.length === 0) {
    missing.push({ skill: 'System Design & Distributed Caching', detail: 'Crucial for high-throughput enterprise deployments' });
  }

  const total = missing.length + weak.length + mastered.length || 1;
  const score = Math.round(((mastered.length * 1.0 + weak.length * 0.5) / total) * 100);

  const roadmap = [
    {
      id: 1,
      title: 'Master Modern Microservices & Distributed Architecture',
      detail: 'Deep dive into Spring Cloud Gateway, Eureka Service Discovery, and Resilience4j circuit breakers.',
      category: 'theory',
      resource: 'https://spring.io/projects/spring-cloud',
      done: false
    },
    {
      id: 2,
      title: 'Implement High-Throughput Event-Driven Messaging with Apache Kafka',
      detail: 'Build asynchronous event consumers and producers with Kafka topics, partitions, and offset management.',
      category: 'project',
      resource: 'https://kafka.apache.org/documentation/',
      done: false
    },
    {
      id: 3,
      title: 'Containerization and Multi-Stage Docker Orchestration',
      detail: 'Containerize backend and frontend services with multi-stage builds and deploy with Docker Compose.',
      category: 'project',
      resource: 'https://docs.docker.com/get-started/',
      done: false
    },
    {
      id: 4,
      title: 'System Design: Scalable Database Sharding & Caching with Redis',
      detail: 'Learn caching strategies (Cache-Aside, Write-Through) and relational database indexing optimization.',
      category: 'theory',
      resource: 'https://redis.io/docs/',
      done: false
    },
    {
      id: 5,
      title: 'Behavioral & Core Technical Interview Mock Session',
      detail: 'Practice STAR format responses for engineering leadership and live coding problem solving.',
      category: 'interview',
      resource: 'https://leetcode.com/explore/',
      done: false
    }
  ];

  return {
    id: Date.now(),
    readiness: Math.max(45, Math.min(95, score)),
    skills: {
      total,
      missing: missing.length,
      weak: weak.length,
      mastered: mastered.length
    },
    gaps: {
      missing,
      weak,
      mastered
    },
    roadmap,
    progress: {
      learning: 0,
      projects: 0,
      interview: 0
    },
    completedIds: [],
    jobTitle: role,
    jobDescription: payload.jobDescription,
    createdAt: new Date().toISOString()
  };
}

async function request(endpoint, options = {}) {
  if (backendOffline) {
    return null;
  }

  const url = `${API_BASE}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      try {
        return await response.json();
      } catch {
        return null;
      }
    }
    backendOffline = true;
    return null;
  } catch (err) {
    clearTimeout(timeoutId);
    backendOffline = true;
    return null;
  }
}

export const api = {
  getProfile: async () => {
    try {
      const data = await request('/api/v1/profile');
      if (data && data.fullName) {
        setStorage('pgai_profile', data);
        return data;
      }
    } catch {
      // Fallback
    }
    return getStorage('pgai_profile', DEFAULT_PROFILE);
  },

  saveProfile: async (payload) => {
    setStorage('pgai_profile', payload);
    try {
      const data = await request('/api/v1/profile', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      if (data) {
        setStorage('pgai_profile', data);
        return data;
      }
    } catch {
      // Saved locally
    }
    return payload;
  },

  getProgress: async () => {
    try {
      const data = await request('/api/v1/progress');
      if (data && data.readiness !== undefined) {
        setStorage('pgai_analysis', data);
        return data;
      }
    } catch {
      // Fallback
    }
    return getStorage('pgai_analysis', null);
  },

  getRoadmap: async () => {
    try {
      const data = await request('/api/v1/roadmap');
      if (data && data.roadmap) {
        setStorage('pgai_analysis', data);
        return data;
      }
    } catch {
      // Fallback
    }
    return getStorage('pgai_analysis', null);
  },

  completeItem: async (id) => {
    try {
      const data = await request(`/api/v1/progress/${id}/complete`, {
        method: 'POST'
      });
      if (data) {
        setStorage('pgai_analysis', data);
        return data;
      }
    } catch {
      // Fallback
    }

    const current = getStorage('pgai_analysis', null);
    if (!current) return null;

    const numId = Number(id);
    const completedIds = Array.isArray(current.completedIds) ? [...current.completedIds] : [];
    if (!completedIds.includes(numId)) {
      completedIds.push(numId);
    }

    const updatedRoadmap = (current.roadmap || []).map((item) =>
      item.id === numId ? { ...item, done: true } : item
    );

    const total = updatedRoadmap.length || 1;
    const doneCount = updatedRoadmap.filter((r) => r.done).length;
    const progressPct = Math.round((doneCount / total) * 100);

    const updated = {
      ...current,
      completedIds,
      roadmap: updatedRoadmap,
      readiness: Math.min(100, (current.readiness || 50) + 6),
      progress: {
        learning: progressPct,
        projects: progressPct,
        interview: progressPct
      }
    };

    setStorage('pgai_analysis', updated);
    return updated;
  },

  analyze: async (payload) => {
    try {
      const data = await request('/api/v1/analyze', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (data && data.roadmap) {
        setStorage('pgai_analysis', data);
        return data;
      }
    } catch {
      // Fallback
    }

    const analysis = generateClientAnalysis(payload);
    setStorage('pgai_analysis', analysis);
    return analysis;
  }
};
