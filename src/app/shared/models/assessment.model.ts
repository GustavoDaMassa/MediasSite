export interface AssessmentDTO {
  id: number;
  identifier: string;
  grade: number;
  maxValue: number;
  requiredGrade: number;
  requiredGradeMaxNear: number;
  fixed: boolean;
}

export interface GradeUpdateRequest {
  value: number;
}
