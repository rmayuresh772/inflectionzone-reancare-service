import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { BloodPressureService } from '../../../../services/clinical/biometrics/blood.pressure.service';
import { Loader } from '../../../../startup/loader';
import { BloodPressureValidator } from '../../../validators/clinical/biometrics/blood.pressure.validator';
import { BaseController } from '../../base.controller';
import { Logger } from '../../../../common/logger';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodPressureController extends BaseController {

    //#region member variables and constructors

    _service: BloodPressureService = null;

    _validator: BloodPressureValidator = new BloodPressureValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(BloodPressureService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('Biometrics.BloodPressure.Create', request, response);

            const model = await this._validator.create(request);
            const bloodPressure = await this._service.create(model);
            if (bloodPressure == null) {
                throw new ApiError(400, 'Cannot create record for blood pressure!');
            }

            ResponseHandler.success(request, response, 'Blood pressure record created successfully!', 201, {
                BloodPressure : bloodPressure,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('Biometrics.BloodPressure.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const bloodPressure = await this._service.getById(id);
            if (bloodPressure == null) {
                throw new ApiError(404, ' Blood pressure record not found.');
            }

            ResponseHandler.success(request, response, 'Blood pressure record retrieved successfully!', 200, {
                BloodPressure : bloodPressure,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('Biometrics.BloodPressure.Search', request, response);

            Logger.instance().log(`trying to fetch data for search...`);
            const filters = await this._validator.search(request);
            Logger.instance().log(`Validations passed:: ${JSON.stringify(filters)}`);
            const searchResults = await this._service.search(filters);
            Logger.instance().log(`result length.: ${searchResults.Items.length}`);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} blood pressure records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                BloodPressureRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('Biometrics.BloodPressure.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood Pressure record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update blood pressure record!');
            }

            ResponseHandler.success(request, response, 'Blood pressure record updated successfully!', 200, {
                BloodPressure : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('Biometrics.BloodPressure.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood pressure record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Blood pressure record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Blood pressure record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
