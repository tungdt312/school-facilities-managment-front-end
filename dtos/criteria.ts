
// --Request--

export interface CriteriaContent {
    content: string;
}

export interface CreateCriteriaListRequest {
    categoryId: string;
    contents: CriteriaContent[];
}

export interface CreateCriteriaRequest {
    categoryId: string;
    content: string;
}

export interface UpdateCriteriaRequest {
    categoryId: string;
    content?: string;
}

// --Response--

export interface CriteriaResponse {
    criteriaId: string;
    categoryId: string;
    content: string;
}