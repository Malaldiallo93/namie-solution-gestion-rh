import React from 'react';
import HRMetrics from '../components/hr/HRMetrics';
import GenderContractChart from '../components/hr/GenderContractChart';
import DepartmentDistributionChart from '../components/hr/DepartmentDistributionChart';
import RecruitmentPipelineChart from '../components/hr/RecruitmentPipelineChart';
import WorkforceEvolutionChart from '../components/hr/WorkforceEvolutionChart';
import AttendanceTable from '../components/hr/AttendanceTable';

function HRDashboard() {
  return (
    <>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Dashboard RH
        </h1>
      </div>

      {/* Metrics Cards */}
      <div className="mb-8">
        <HRMetrics />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-12 gap-6">
        {/* Gender and Contract Distribution Chart */}
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
          <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">Répartition H/F et types de contrats</h2>
          </header>
          <GenderContractChart />
        </div>

        {/* Department Distribution */}
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
          <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">Répartition par département</h2>
          </header>
          <DepartmentDistributionChart />
        </div>

        {/* Recruitment Pipeline */}
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
          <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">Pipeline de recrutement</h2>
          </header>
          <RecruitmentPipelineChart />
        </div>

        {/* Workforce Evolution */}
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
          <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">Évolution des effectifs</h2>
          </header>
          <WorkforceEvolutionChart />
        </div>

        {/* Attendance Table */}
        <div className="flex flex-col col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
          <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">Présence aujourd'hui</h2>
          </header>
          <AttendanceTable />
        </div>
      </div>
    </>
  );
}

export default HRDashboard; 