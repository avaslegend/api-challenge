import { ContentfulItemFields } from "./contentful-item-fields.interface";
import { ContentfulSys } from "./contentful-sys.interface";

export interface ContentfulItem {
    sys: ContentfulSys;
    fields: ContentfulItemFields;
}