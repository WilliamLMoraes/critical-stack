export default interface CampaignGridRequest {
  name: string;
  width: number;
  height: number;
  cellSize: number;
  lineColor?: string;
  backgroundColor?: string;
  showGrid: boolean;
  imageBackgroundUrl?: string | null;
  description?: string;
  showBackgroundImage: boolean;
  folderId?: number | null;
}
