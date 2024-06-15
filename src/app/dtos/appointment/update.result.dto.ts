export class UpdateResultDTO {
    appointment_id : number;
    clinical_diagnosis : string;
    result : string;
    files : File[] = [];

    constructor(data: any) {
        this.appointment_id = data.appointment_id;
        this.clinical_diagnosis = data.clinical_diagnosis;
        this.result = data.result;
        this.files = data.files || [];
    }
}