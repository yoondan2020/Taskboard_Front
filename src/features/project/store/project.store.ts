// src/store/project.store.ts

import { create } from "zustand";
import { projectApi, } from "@/shared/lib/api/project";
import type {
    CreateProjectDTO,
    UpdateProjectDTO,
    ProjectDTO,
    ProjectOut,
    DetailProject,
    SummaryProjectDTO,
    ChangeProjectOwnerDTO,
} from "@/shared/types/project.types";
import { log } from "@/shared/lib/log";

type ProjectSort = "latest" | "oldest";

type ProjectFilters = {
    q: string;
    productGroupId?: number; // 프로젝트 구분
    stateId?: number;        // 진행 상태
    onwerId?: number;        // 담당자
    sort: ProjectSort;
};

type State = {
    items: ProjectOut[];
    projectSummary: SummaryProjectDTO[]; // 대시보드 카드 리스트
    projectDetail: DetailProject | null; // 디테일 프로젝트

    myProjects: SummaryProjectDTO[]; // 내가 담당자인 프로젝트
    relatedProject: SummaryProjectDTO[]; // 유관자인 프로젝트

    urgentProjectsCount: number; // 마감 임박 프로젝트 수
    urgentProjects: SummaryProjectDTO[]; // 마감 임박 프로젝트
    deadlineProjects: SummaryProjectDTO[];  // 특정 날짜 마감 프로젝트
    selectedDate: Date;  // 선택된 날짜

    projectData: ProjectDTO | null;
    loading: boolean;
    error: string | null;
    filters: ProjectFilters;
    myPagefilters: ProjectFilters;

    setFilters: (patch: Partial<ProjectFilters>) => void;
    getFilteredProjectSummary: () => SummaryProjectDTO[];
    setMyPageFilters: (patch: Partial<ProjectFilters>) => void;
    getMyPageFilteredProjectSummary: () => SummaryProjectDTO[];

    create: (
        data: {
            dto: CreateProjectDTO;
            thumbnail?: File;
        }
    ) => Promise<void>;

    fetchProjectSummary: () => Promise<void>;
    fetchDetail: (id: number) => Promise<void>; // 디테일

    fetchMyProject: () => Promise<void>; // 내 프로젝트 
    fetchRelatedProject: () => Promise<void>; // 유관 프로젝트
    fetchDeadlineProjects: (date: string) => Promise<void>;  // 특정 날짜 마감 프로젝트
    setSelectedDate: (date: Date) => void;

    fetchUpdateForm: (id: number) => Promise<void>;

    fetchUrgentProjectsCount: () => Promise<void>;
    fetchUrgentProjects: () => Promise<void>;

    update: (id: number, data: {
        dto: UpdateProjectDTO;
        thumbnail?: File;
    }) => Promise<void>;

    changeOwner: (id: number, data: ChangeProjectOwnerDTO) => Promise<void>;
    delete: (id: number) => Promise<void>;

    clearError: () => void;
};

export const useProjectStore = create<State>((set, get) => ({
    items: [],
    projectSummary: [],
    myProjects: [],
    relatedProject: [],
    projectDetail: null,
    urgentProjectsCount: 0,
    urgentProjects: [],
    deadlineProjects: [],
    selectedDate: new Date(),
    projectData: null,
    loading: false,
    error: null,

    clearError: () => set({ error: null }),

    // 초기 필터
    filters: {
        q: "",
        productGroupId: undefined,
        stateId: 2,
        onwerId: undefined,
        sort: "latest",
    },

    myPagefilters: {
        q: "",
        productGroupId: undefined,
        stateId: 2,
        sort: "latest",
    },

    // 대시보드 필터
    setFilters: (patch) =>
        set((s) => ({ filters: { ...s.filters, ...patch } })),


    getFilteredProjectSummary: () => {
        const { projectSummary, filters } = get();
        const q = (filters.q ?? "").trim().toLowerCase();

        let list = projectSummary.filter((p) => {
            // 검색어
            const matchQ =
                !q || (p.title ?? "").toLowerCase().includes(q);

            // ProjectGroup 필터링
            const matchProductGroup =
                !filters.productGroupId || p.product_group_id === filters.productGroupId;

            // 진행 상태
            const matchState =
                !filters.stateId || p.state_id === filters.stateId;

            // 담당자 필터링
            const matchOwner =
                !filters.onwerId || p.owner_id === filters.onwerId;

            return matchQ && matchProductGroup && matchState && matchOwner;
        });

        const getTime = (p: any) =>
            +(new Date(p.updated_at ?? p.created_at ?? 0));

        if (filters.sort === "latest") {
            list = list.slice().sort((a: any, b: any) => getTime(b) - getTime(a));
        } else {
            list = list.slice().sort((a: any, b: any) => getTime(a) - getTime(b));
        }

        return list;
    },

    // 마이페이지 필터
    setMyPageFilters: (patch) =>
        set((s) => ({ myPagefilters: { ...s.myPagefilters, ...patch } })),


    getMyPageFilteredProjectSummary: () => {
        const { projectSummary, myPagefilters } = get();
        const q = (myPagefilters.q ?? "").trim().toLowerCase();

        let list = projectSummary.filter((p) => {
            // 검색어
            const matchQ =
                !q || (p.title ?? "").toLowerCase().includes(q);

            // ProjectGroup 필터링
            const matchProductGroup =
                !myPagefilters.productGroupId || p.product_group_id === myPagefilters.productGroupId;

            // 진행 상태
            const matchState =
                !myPagefilters.stateId || p.state_id === myPagefilters.stateId;

            return matchQ && matchProductGroup && matchState;
        });

        const getTime = (p: any) =>
            +(new Date(p.updated_at ?? p.created_at ?? 0));

        if (myPagefilters.sort === "latest") {
            list = list.slice().sort((a: any, b: any) => getTime(b) - getTime(a));
        } else {
            list = list.slice().sort((a: any, b: any) => getTime(a) - getTime(b));
        }

        return list;
    },

    create: async ({
        dto,
        thumbnail,
    }) => {
        log("[API] createProject payload:", dto);
        set({ loading: true, error: null });
        try {
            await projectApi.create(dto,
                thumbnail);
            const projectSummary = await projectApi.projectList();
            set({ projectSummary });
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },

    fetchProjectSummary: async () => {
        set({ loading: true, error: null });
        try {
            const data = await projectApi.projectList();
            log("[API] fetch list", data);
            set({ projectSummary: data });
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },

    fetchDetail: async (id) => {
        set({ loading: true, error: null });
        try {
            const data = await projectApi.projectDetail(id);
            log("[API] fetchDetail data:", data);
            set({ projectDetail: data });
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },

    // 담당 프로젝트
    fetchMyProject: async () => {
        set({ loading: true, error: null });
        try {
            const data = await projectApi.myProjects();
            log("[API] fetchMyProject data:", data);
            set({ myProjects: data });
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },

    // 유관 프로젝트
    fetchRelatedProject: async () => {
        set({ loading: true, error: null });
        try {
            const data = await projectApi.relatedProjects();
            log("[API] fetchRelatedProject data", data);
            set({ relatedProject: data });
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },

    // 수정 모달 정보 가져오기
    fetchUpdateForm: async (id) => {
        set({ loading: true, error: null });
        try {
            const data = await projectApi.fetchUpdateForm(id);
            log("[API] fetchUpdateForm data:", data);
            set({ projectData: data });
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },

    // 마감 임박 프로젝트 수
    fetchUrgentProjectsCount: async () => {
        set({ loading: true, error: null });
        try {
            const data = await projectApi.urgentProjectsCount();
            log("[API] urgentProjectsCount data:", data);
            set({ urgentProjectsCount: data });
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },

    // 마감 임박 프로젝트
    fetchUrgentProjects: async () => {
        set({ loading: true, error: null });
        try {
            const data = await projectApi.urgentProjects();
            log("[API] urgentProjects data:", data);
            set({ urgentProjects: data });
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },

    // 특정 날짜 마감 임박 프로젝트
    setSelectedDate: (date) => set({ selectedDate: date }),

    fetchDeadlineProjects: async (date) => {
        set({ loading: true, error: null });
        try {
            const data = await projectApi.deadlineProjects(date);
            log("[API] deadlineProjects data:", data);
            set({ deadlineProjects: data });
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },

    update: async (id, { dto, thumbnail }) => {
        log("[API] updateProject payload:", dto);
        set({ loading: true, error: null });
        try {
            await projectApi.update(id, dto, thumbnail);
            const projectSummary = await projectApi.projectList();
            set({ projectSummary });
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },

    changeOwner: async (id, data) => {
        log("[API] changeOwner payload:", data);
        set({ loading: true, error: null });
        try {
            await projectApi.changeOwner(id, data);
            const projectSummary = await projectApi.projectList();
            set({ projectSummary });
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },

    delete: async (id) => {
        set({ loading: true, error: null });
        try {
            await projectApi.delete(id);
            set((state) => ({
                projectSummary: state.projectSummary.filter((p) => p.id !== id),
            }));
        } catch (e: any) {
            set({ error: e?.message ?? String(e) });
        } finally {
            set({ loading: false });
        }
    },
}));
