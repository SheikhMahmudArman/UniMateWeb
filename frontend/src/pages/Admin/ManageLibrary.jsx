import ResourceManager from './ResourceManager';
import { libraryFields } from './resourceFields';

export default function ManageLibrary() {
    return <ResourceManager title="Manage Library" resource="library" fields={libraryFields} />;
}
