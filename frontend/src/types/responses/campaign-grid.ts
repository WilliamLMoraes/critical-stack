export default interface CampaignGridResponse {
  id: number;
  campaignId: number;
  folderId: number | null;
  name: string;
  width: number;
  height: number;
  cellSize: number;
  lineColor: string;
  backgroundColor: string;
  showGrid: boolean;
  imageBackgroundUrl: string | null;
}
