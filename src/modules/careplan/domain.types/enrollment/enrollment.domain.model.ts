export interface EnrollmentDomainModel {
    id?           : string;
    Name?         : string;
    UserId        : string;
    Provider?     : string;
    PlanCode?     : string;
    PlanName?     : string;
    ParticipantId?: string;
    EnrollmentId? : string;
    StartDateStr? : string;
    EndDateStr?   : string;
    StartDate?    : Date;
    EndDate?      : Date;
    Gender?       : string;
    BirthDate?    : Date;
}
