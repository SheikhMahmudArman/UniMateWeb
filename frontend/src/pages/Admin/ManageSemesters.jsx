import ResourceManager from './ResourceManager';
import { semesterFields } from './resourceFields';

export default function ManageSemesters() {
    return <ResourceManager title="Manage Semester Drives" resource="semesters" fields={semesterFields} />;
}
