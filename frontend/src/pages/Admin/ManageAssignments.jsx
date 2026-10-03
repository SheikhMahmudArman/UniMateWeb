import ResourceManager from './ResourceManager';
import { assignmentFields } from './resourceFields';

export default function ManageAssignments() {
    return <ResourceManager title="Manage Assignments" resource="assignments" fields={assignmentFields} courseBased />;
}
