import { IBodyHeightRepo } from '../../../../repository.interfaces/biometrics/body.height.repo.interface';
import BodyHeight from '../../models/biometrics/body.height.model';
import { Op } from 'sequelize';
import { BodyHeightMapper } from '../../mappers/biometrics/body.height.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { BodyHeightDomainModel } from '../../../../../domain.types/biometrics/body.height/body.height.domain.model';
import { BodyHeightDto } from '../../../../../domain.types/biometrics/body.height/body.height.dto';
import { BodyHeightSearchFilters, BodyHeightSearchResults } from '../../../../../domain.types/biometrics/body.height/body.height.search.types';

///////////////////////////////////////////////////////////////////////

export class BodyHeightRepo implements IBodyHeightRepo {

    create = async (BodyHeightDomainModel: BodyHeightDomainModel): Promise<BodyHeightDto> => {
        try {
            const entity = {
                PatientUserId : BodyHeightDomainModel.PatientUserId,
                BodyHeight    : BodyHeightDomainModel.BodyHeight ?? 0,
                Unit          : BodyHeightDomainModel.Unit ?? 'cm'
            };
            const bodyHeight = await BodyHeight.create(entity);
            const dto = await BodyHeightMapper.toDto(bodyHeight);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<BodyHeightDto> => {
        try {
            const address = await BodyHeight.findByPk(id);
            const dto = await BodyHeightMapper.toDto(address);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: BodyHeightSearchFilters): Promise<BodyHeightSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = { [Op.like]: '%' + filters.PatientUserId + '%' };
            }
            if (filters.MinValue != null && filters.MaxValue != null) {
                search.where['BodyHeight'] = {
                    [Op.gte] : filters.MinValue,
                    [Op.lte] : filters.MaxValue,
                };
            }
            if (filters.CreatedDateFrom != null && filters.CreatedDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                    [Op.lte] : filters.CreatedDateTo,
                };
            } else if (filters.CreatedDateFrom === null && filters.CreatedDateTo !== null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.CreatedDateTo,
                };
            } else if (filters.CreatedDateFrom !== null && filters.CreatedDateTo === null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                };
            }
            let orderByColum = 'BodyHeight';
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

            const foundResults = await BodyHeight.findAndCountAll(search);

            const dtos: BodyHeightDto[] = [];
            for (const address of foundResults.rows) {
                const dto = await BodyHeightMapper.toDto(address);
                dtos.push(dto);
            }

            const searchResults: BodyHeightSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };

            return searchResults;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, BodyHeightDomainModel: BodyHeightDomainModel): Promise<BodyHeightDto> => {
        try {
            const bodyHeight = await BodyHeight.findByPk(id);

            if (BodyHeightDomainModel.BodyHeight != null) {
                bodyHeight.BodyHeight = BodyHeightDomainModel.BodyHeight;
            }
            if (BodyHeightDomainModel.Unit != null) {
                bodyHeight.Unit = BodyHeightDomainModel.Unit;
            }
            await bodyHeight.save();

            const dto = await BodyHeightMapper.toDto(bodyHeight);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await BodyHeight.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
