export type Silabo = {
    id: string | null;
    courseId: string | null;
    courseName?: string;
    schoolId: string;
    grade: number;
    silabusData: {
        description: string;
        goals: string;
        method: string;
        bibliography: string;
        topics: Record<string, string>
    } 
  }
  
       
              