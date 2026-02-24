import { AssessmentDTO } from './assessment.model';

export interface ProjectionDTO {
  id: number;
  name: string;
  assessment: AssessmentDTO[];
  finalGrade: number;
  courseName?: string;
}
