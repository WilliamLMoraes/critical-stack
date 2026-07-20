import { BsGrid3X3, BsBell, BsSearch } from "react-icons/bs";
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import { MdOutlineGridOff, MdCampaign, MdSettings, MdOutlinePerson } from "react-icons/md";
import { TbBackground, TbLibrary, TbWorld } from "react-icons/tb";
import { FaRegImage, FaUserGroup } from "react-icons/fa6";
import {
  IoChevronDown, IoEyeOutline, IoTrashOutline, IoAddOutline,
  IoFolderOutline, IoLogOutOutline,
} from "react-icons/io5";
import { FiEdit, FiUser } from "react-icons/fi";
import { RiSparkling2Line } from "react-icons/ri";
import { GiDiceTwentyFacesTwenty } from "react-icons/gi";

import type { IconType } from "react-icons";

export const GridResizeIcon: IconType = BsGrid3X3;
export const GridChangeColorIcon: IconType = TfiLayoutGrid3Alt;
export const GridOffIcon: IconType = MdOutlineGridOff;
export const BackgroundIcon: IconType = TbBackground;
export const ImageIcon: IconType = FaRegImage;
export const PersonGroupIcon: IconType = FaUserGroup;
export const EyeIcon: IconType = IoEyeOutline;
export const EditIcon: IconType = FiEdit;
export const TrashIcon: IconType = IoTrashOutline;
export const PlusIcon: IconType = IoAddOutline;
export const FolderIcon: IconType = IoFolderOutline;
export const ChevronIcon: IconType = IoChevronDown;
export const SearchIcon: IconType = BsSearch;
export const BellIcon: IconType = BsBell;
export const UserIcon: IconType = FiUser;
export const LogoutIcon: IconType = IoLogOutOutline;
export const CampaignIcon: IconType = MdCampaign;
export const CharacterIcon: IconType = MdOutlinePerson;
export const LibraryIcon: IconType = TbLibrary;
export const CommunityIcon: IconType = TbWorld;
export const SettingsIcon: IconType = MdSettings;
export const SparklesIcon: IconType = RiSparkling2Line;
export const D20Icon: IconType = GiDiceTwentyFacesTwenty;
