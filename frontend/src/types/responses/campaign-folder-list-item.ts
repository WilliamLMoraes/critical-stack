export default interface CampaignFolderListResponse {
  id: number;
  campaignId: number;
  parentId: number | null;
  name: string;
  gridCount: number;
  createdAt: string;
}
