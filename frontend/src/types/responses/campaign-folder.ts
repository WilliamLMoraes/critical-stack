import type CampaignGridListItemResponse from "./campaign-grid-list-item";
import type CampaignFolderListResponse from "./campaign-folder-list-item";

export default interface CampaignFolderResponse {
  id: number;
  campaignId: number;
  parentId: number | null;
  name: string;
  gridCount: number;
  grids: CampaignGridListItemResponse[];
  children: CampaignFolderListResponse[];
  createdAt: string;
  updatedAt: string;
}
