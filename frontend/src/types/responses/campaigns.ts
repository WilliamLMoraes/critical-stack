export default interface CampaignsResponse {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  urlImage: string | null;
  rootFolderId: number | null;
  owner?: string;
  createdAt?: string;
}