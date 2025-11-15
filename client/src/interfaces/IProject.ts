import type { CurrencyEnum } from "../Enums/CurrencyEnum";
import type { ProjectSourceEnum } from "../Enums/ProjectSourceEnum";
import type { ProjectStatusEnum } from "../Enums/ProjectStatusEnum";
import type { ProjectType } from "../Enums/ProjectTypeEnum";
import type { IClient } from "./IClient";
import type { IUser } from "./IUser";

export interface IProject {
  _id: string;
  name: string;
  description: string;
  type: ProjectType;
  source: ProjectSourceEnum;
  source_info: string;
  responsible: IUser;
  status: ProjectStatusEnum;
  price: string;
  quotation: string;
  files: string[];
  currency: CurrencyEnum;
  client_id: IClient[];
}
