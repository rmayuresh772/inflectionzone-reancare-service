import { BaseSearchFilters, BaseSearchResults } from "../../../domain.types/miscellaneous/base.search.types";
import { KnowledgeNuggetDto } from "./knowledge.nugget.dto";

//////////////////////////////////////////////////////////////////////

export interface KnowledgeNuggetSearchFilters extends BaseSearchFilters{
    TopicName?: string;
    Tag?      : string;

}

export interface KnowledgeNuggetSearchResults extends BaseSearchResults{
    Items: KnowledgeNuggetDto[];
}
