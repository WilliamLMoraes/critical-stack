import type CampaignFolderListResponse from "./campaign-folder-list-item";
import type CampaignGridListItemResponse from "./campaign-grid-list-item";

export default interface CampaignSearchResponse {
  folders: CampaignFolderListResponse[];
  grids: CampaignGridListItemResponse[];
}
