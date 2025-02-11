export type Silabo = {
    id: string;
    courseId: string | null;
    courseName?: string;
    schoolId: string;
    grade: number;
    silabusData: {
        description: string;
        goals: string;
        method: string;
        bibliography: string;
        topics: string[];
    }
  }
  
       
              