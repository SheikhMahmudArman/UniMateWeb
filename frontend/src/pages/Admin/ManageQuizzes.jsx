import ResourceManager from './ResourceManager';
import { quizFields } from './resourceFields';

export default function ManageQuizzes() {
    return <ResourceManager title="Manage Quizzes" resource="quizzes" fields={quizFields} courseBased />;
}
