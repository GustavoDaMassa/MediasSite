export interface CourseDTO {
  id: number;
  name: string;
  averageMethod: string;
  cutOffGrade: number;
}

export interface CreateCourseRequest {
  name: string;
  averageMethod: string;
  cutOffGrade: number;
}
