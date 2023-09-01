import express from 'express';
import { BaseValidator, Where } from '../base.validator';
import { AppDownloadDomainModel } from '../../domain.types/statistics/app.download.domain.model';
import { ExecuteQueryDomainModel } from '../../domain.types/statistics/execute.query.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class StatistcsValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): AppDownloadDomainModel => {

        const AppDownloadModel: AppDownloadDomainModel = {
            AppName          : request.body.AppName,
            TotalDownloads   : request.body.TotalDownloads,
            IOSDownloads     : request.body.IOSDownloads,
            AndroidDownloads : request.body.AndroidDownloads,
           
        };

        return AppDownloadModel;
    };

    updateAppDownloads = async (request: express.Request): Promise<AppDownloadDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    searchFilter = async (request: express.Request): Promise<any> => {

        await this.validateDecimal(request, 'year', Where.Query, false, false);
        await this.validateDecimal(request, 'month', Where.Query, false, true);
        await this.validateDate(request, 'from', Where.Query, false, true);
        await this.validateDate(request, 'to', Where.Query, false, true);
        await this.validateDecimal(request, 'pastMonths', Where.Query, false, true);
        this.validateRequest(request);

        return this.getFilter(request);
    };

    private getFilter(request) {

        const filters = {
            Year       : request.query.year ?? null,
            Month      : request.query.month ?? null,
            From       : request.query.from ?? null,
            To         : request.query.to ?? null,
            PastMonths : request.query.pastMonths ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

    searchFilterForAge = async (request: express.Request): Promise<any> => {

        await this.validateDecimal(request, 'year', Where.Query, false, false);
        await this.validateDecimal(request, 'ageFrom', Where.Query, false, false);
        await this.validateDecimal(request, 'ageTo', Where.Query, false, false);
     
        this.validateRequest(request);

        return this.getFilterForAge(request);
    };

    getQueryModel = (request: express.Request): ExecuteQueryDomainModel => {

        const executeQueryDomainModel: ExecuteQueryDomainModel = {
            Name        : request.body.Name,
            Format      : request.body.Format ?? null,
            Description : request.body.Description ?? null,
            UserId      : request.body.UserId ?? null,
            TenantId    : request.body.TenantId ?? null
        };

        return executeQueryDomainModel;
    };

    validateQuery = async (request: express.Request): Promise<ExecuteQueryDomainModel> => {
        await this.validateQueryBody(request);
        return this.getQueryModel(request);
    };

    private getFilterForAge(request) {

        const filters = {
            Year    : request.query.year ?? null,
            AgeFrom : request.query.ageFrom ?? null,
            AgeTo   : request.query.ageTo ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

    private  async validateCreateBody(request) {

        await this.validateString(request, 'AppName', Where.Body, false, true);
        await this.validateDecimal(request, 'TotalDownloads', Where.Body, false, true);
        await this.validateDecimal(request, 'IOSDownloads', Where.Body, false, true);
        await this.validateDecimal(request, 'AndroidDownloads', Where.Body, false, true);
        this.validateRequest(request);
    }

    private  async validateQueryBody(request) {

        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'Format', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateUuid(request, 'UserId', Where.Body, false, true);
        await this.validateUuid(request, 'TenentId', Where.Body, false, true);
        this.validateRequest(request);
    }

}
