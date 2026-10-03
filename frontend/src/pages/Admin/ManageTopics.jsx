import ResourceManager from './ResourceManager';
import { topicFields } from './resourceFields';

export default function ManageTopics() {
    return <ResourceManager title="Manage Topics" resource="topics" fields={topicFields} courseBased />;
}
