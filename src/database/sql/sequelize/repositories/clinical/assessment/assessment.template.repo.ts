import { Op } from 'sequelize';
import { AssessmentTemplateSearchFilters } from '../../../../../../domain.types/clinical/assessment/assessment.template.search.types';
import { AssessmentTemplateSearchResults } from '../../../../../../domain.types/clinical/assessment/assessment.template.search.types';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { AssessmentTemplateDomainModel } from '../../../../../../domain.types/clinical/assessment/assessment.template.domain.model';
import { AssessmentTemplateDto } from '../../../../../../domain.types/clinical/assessment/assessment.template.dto';
import { IAssessmentTemplateRepo } from '../../../../../repository.interfaces/clinical/assessment/assessment.template.repo.interface';
import { AssessmentTemplateMapper } from '../../../mappers/clinical/assessment/assessment.template.mapper';
import AssessmentTemplate from '../../../models/clinical/assessment/assessment.template.model';

///////////////////////////////////////////////////////////////////////

export class AssessmentTemplateRepo implements IAssessmentTemplateRepo {

    create = async (model: AssessmentTemplateDomainModel): Promise<AssessmentTemplateDto> => {
        try {
            const entity = {
                DisplayCode            : model.DisplayCode ?? null,
                Type                   : model.Type ?? null,
                Title                  : model.Title ?? model.Title,
                Description            : model.Description ?? null,
                ProviderAssessmentCode : model.ProviderAssessmentCode ?? null,
                Provider               : model.Provider ?? null,
            };
            const assessmentTemplate = await AssessmentTemplate.create(entity);
            return await AssessmentTemplateMapper.toDto(assessmentTemplate);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<AssessmentTemplateDto> => {
        try {
            const assessmentTemplate = await AssessmentTemplate.findByPk(id);
            return await AssessmentTemplateMapper.toDto(assessmentTemplate);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByProviderAssessmentCode = async (provider: string, providerAssessmentCode: string)
        : Promise<AssessmentTemplateDto> => {
        try {
            const assessmentTemplate = await AssessmentTemplate.findOne({
                where : {
                    Provider               : provider,
                    ProviderAssessmentCode : providerAssessmentCode
                }
            });
            return await AssessmentTemplateMapper.toDto(assessmentTemplate);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    search = async (filters: AssessmentTemplateSearchFilters): Promise<AssessmentTemplateSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Title != null) {
                search.where['Title'] = { [Op.like]: '%' + filters.Title + '%' };
            }
            if (filters.Type != null) {
                search.where['Type'] = { [Op.like]: '%' + filters.Type + '%' };
            }

            let orderByColum = 'Title';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await AssessmentTemplate.findAndCountAll(search);

            const dtos: AssessmentTemplateDto[] = [];
            for (const doctorNote of foundResults.rows) {
                const dto = await AssessmentTemplateMapper.toDto(doctorNote);
                dtos.push(dto);
            }

            const searchResults: AssessmentTemplateSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos
            };
            return searchResults;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, updateModel: AssessmentTemplateDomainModel): Promise<AssessmentTemplateDto> => {
        try {
            const assessmentTemplate = await AssessmentTemplate.findByPk(id);

            if (updateModel.Type != null) {
                assessmentTemplate.Type = updateModel.Type;
            }
            if (updateModel.Title != null) {
                assessmentTemplate.Title = updateModel.Title;
            }
            if (updateModel.Description != null) {
                assessmentTemplate.Description = updateModel.Description;
            }
            if (updateModel.ProviderAssessmentCode != null) {
                assessmentTemplate.ProviderAssessmentCode = updateModel.ProviderAssessmentCode;
            }
            if (updateModel.Provider != null) {
                assessmentTemplate.Provider = updateModel.Provider;
            }
            await assessmentTemplate.save();

            return await AssessmentTemplateMapper.toDto(assessmentTemplate);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await AssessmentTemplate.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}