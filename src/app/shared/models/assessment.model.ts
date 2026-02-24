export interface AssessmentDTO {
  id: number;
  identifier: string;
  grade: number;
  maxValue: number;
  requiredGrade: number;
  fixed: boolean;
}

export interface GradeUpdateRequest {
  value: number;
}
