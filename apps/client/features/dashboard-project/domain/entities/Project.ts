export class Project {
    constructor(
        public id: string,
        public titre: string,
        public description: string,
        public leadId: string,
        public createdAt: string,
        public lead?: {
            name: string
        }
    ) {}
}