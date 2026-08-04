import React, { useState, useEffect } from 'react';
import { PrescriptionPlan, SavedPlanMeta } from './types';
import { YAMAGATA_SAMPLE_PLAN, INITIAL_EMPTY_PLAN } from './data/sampleData';
import { validatePrescriptionPlan } from './utils/validation';
import {
  loadCurrentPlan,
  saveCurrentPlan,
  getSavedPlansList,
  loadPlanById,
  createNewPlan,
  duplicatePlan,
  deletePlan,
  exportPlanAsJson,
} from './utils/storage';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RightTimeMeter } from './components/RightTimeMeter';
import { BottomNav } from './components/BottomNav';

import { Step1StudentInfo } from './components/steps/Step1StudentInfo';
import { Step2GoalsDeadline } from './components/steps/Step2GoalsDeadline';
import { Step3TimeAvailability } from './components/steps/Step3TimeAvailability';
import { Step4Allocations } from './components/steps/Step4Allocations';
import { Step5MaterialsMethods } from './components/steps/Step5MaterialsMethods';
import { Step6EnvironmentPhoneAI } from './components/steps/Step6EnvironmentPhoneAI';
import { Step7Validation } from './components/steps/Step7Validation';
import { Step8Output } from './components/steps/Step8Output';

import { SavedPlansModal } from './components/SavedPlansModal';
import { ConfirmModal } from './components/ConfirmModal';
import { WeeklyTemporaryVersion } from './components/WeeklyTemporaryVersion';
import { CompactWeeklyPlan } from './components/CompactWeeklyPlan';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showWeeklyTemp, setShowWeeklyTemp] = useState<boolean>(false);
  const [isWeeklyTempModalOpen, setIsWeeklyTempModalOpen] = useState<boolean>(false);
  const [plan, setPlan] = useState<PrescriptionPlan>(() => loadCurrentPlan());
  const [isSavedNotification, setIsSavedNotification] = useState<boolean>(false);

  // Modals state
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [savedPlansList, setSavedPlansList] = useState<SavedPlanMeta[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Auto-save plan to localStorage
  useEffect(() => {
    saveCurrentPlan(plan);
  }, [plan]);

  // Load saved plans list when opening modal
  const handleOpenSavedModal = () => {
    setSavedPlansList(getSavedPlansList());
    setIsSavedModalOpen(true);
  };

  const triggerSaveNotification = () => {
    saveCurrentPlan(plan);
    setIsSavedNotification(true);
    setTimeout(() => setIsSavedNotification(false), 2000);
  };

  // Yamagata sample loader
  const handleLoadYamagataSample = () => {
    setConfirmModal({
      isOpen: true,
      title: '山形さんサンプルの読み込み',
      message: '現在の入力内容が「山形さん（慶應文学部・英検準1級）」の動作検証用サンプルデータに上書きされます。よろしいですか？',
      onConfirm: () => {
        setPlan({
          ...YAMAGATA_SAMPLE_PLAN,
          id: `plan-${Date.now()}`,
          updatedAt: new Date().toISOString(),
        });
        setCurrentStep(1);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        triggerSaveNotification();
      },
    });
  };

  // New plan creation
  const handleNewPlan = () => {
    setConfirmModal({
      isOpen: true,
      title: '新規計画の作成',
      message: '新しい空の学習計画を作成します。よろしいですか？',
      onConfirm: () => {
        const fresh = createNewPlan();
        setPlan(fresh);
        setCurrentStep(1);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        triggerSaveNotification();
      },
    });
  };

  // Reset plan
  const handleResetConfirm = () => {
    setConfirmModal({
      isOpen: true,
      title: '全入力内容の初期化',
      message: '現在の計画の全入力フォームを初期化します。取り消しはできません。実行しますか？',
      onConfirm: () => {
        const fresh: PrescriptionPlan = {
          ...INITIAL_EMPTY_PLAN,
          id: plan.id,
          planTitle: '無題の学習計画書',
          updatedAt: new Date().toISOString(),
        };
        setPlan(fresh);
        setCurrentStep(1);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        triggerSaveNotification();
      },
    });
  };

  // Select plan from list
  const handleSelectPlanFromModal = (id: string) => {
    const loaded = loadPlanById(id);
    if (loaded) {
      setPlan(loaded);
      setIsSavedModalOpen(false);
      triggerSaveNotification();
    }
  };

  // Duplicate plan from modal
  const handleDuplicatePlanFromModal = (id: string) => {
    const loaded = loadPlanById(id);
    if (loaded) {
      const dup = duplicatePlan(loaded);
      setSavedPlansList(getSavedPlansList());
      setPlan(dup);
    }
  };

  // Delete plan from modal
  const handleDeletePlanFromModal = (id: string) => {
    deletePlan(id);
    setSavedPlansList(getSavedPlansList());
  };

  // Import JSON file
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && (parsed.student || parsed.availability)) {
          const importedPlan: PrescriptionPlan = {
            ...parsed,
            id: `plan-${Date.now()}`,
            updatedAt: new Date().toISOString(),
          };
          setPlan(importedPlan);
          setCurrentStep(1);
          triggerSaveNotification();
        } else {
          alert('有効な学習処方箋JSONファイルではありません。');
        }
      } catch (err) {
        alert('JSONファイルの読み込みに失敗しました。');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const { errors, warnings } = validatePrescriptionPlan(plan);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Header */}
      <Header
        plan={plan}
        onUpdatePlanTitle={(title) => setPlan({ ...plan, planTitle: title })}
        onLoadYamagataSample={handleLoadYamagataSample}
        onSave={triggerSaveNotification}
        onNew={handleNewPlan}
        onOpenSavedModal={handleOpenSavedModal}
        onExportJson={() => exportPlanAsJson(plan)}
        onImportJson={handleImportJson}
        onResetConfirm={handleResetConfirm}
        isSavedNotification={isSavedNotification}
        onOpenWeeklyTempModal={() => setCurrentStep(1)}
      />

      {/* Main Workspace (3-column layout) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Column: Step Navigation */}
        <Sidebar
          currentStep={currentStep}
          onSelectStep={(stepId) => setCurrentStep(stepId)}
          errorCount={errors.length}
          warningCount={warnings.length}
        />

        {/* Center Column: Form Step Area */}
        <main className="flex-1 bg-white p-4 md:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Display the super-simplified, elegant Compact Weekly Plan on the top screen for other steps */}
            {currentStep > 1 && (
              <CompactWeeklyPlan
                plan={plan}
                onOpenSettings={() => setCurrentStep(1)}
              />
            )}

            <>
              {currentStep === 1 && (
                <WeeklyTemporaryVersion
                  plan={plan}
                  onUpdatePlan={(updated) => setPlan(updated)}
                />
              )}

              {currentStep === 2 && (
                <Step1StudentInfo
                  student={plan.student}
                  onChange={(updated) => setPlan({ ...plan, student: updated })}
                />
              )}

              {currentStep === 3 && (
                <Step2GoalsDeadline
                  goals={plan.goals}
                  onChange={(updated) => setPlan({ ...plan, goals: updated })}
                />
              )}

              {currentStep === 4 && (
                <Step3TimeAvailability
                  availability={plan.availability}
                  onChange={(updated) => setPlan({ ...plan, availability: updated })}
                />
              )}

              {currentStep === 5 && (
                <Step4Allocations
                  englishAllocations={plan.englishAllocations}
                  otherAllocations={plan.otherSubjectAllocations}
                  availability={plan.availability}
                  onUpdateEnglish={(updated) => setPlan({ ...plan, englishAllocations: updated })}
                  onUpdateOther={(updated) =>
                    setPlan({ ...plan, otherSubjectAllocations: updated })
                  }
                />
              )}

              {currentStep === 6 && (
                <Step5MaterialsMethods
                  materials={plan.materials}
                  studyMethods={plan.studyMethods}
                  englishAllocations={plan.englishAllocations}
                  onUpdateMaterials={(mats) => setPlan({ ...plan, materials: mats })}
                  onUpdateStudyMethods={(methods) => setPlan({ ...plan, studyMethods: methods })}
                />
              )}

              {currentStep === 7 && (
                <Step6EnvironmentPhoneAI
                  environment={plan.environment}
                  onChange={(updated) => setPlan({ ...plan, environment: updated })}
                />
              )}

              {currentStep === 8 && (
                <Step7Validation
                  plan={plan}
                  onUpdatePlan={(updated) => setPlan(updated)}
                  onGoToOutputStep={() => setCurrentStep(9)}
                />
              )}

              {currentStep === 9 && <Step8Output plan={plan} />}
            </>
          </div>
        </main>

        {/* Right Column: Time Calculator & Validation Meter */}
        <RightTimeMeter plan={plan} onGoToStep7={() => setCurrentStep(8)} />
      </div>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        currentStep={currentStep}
        totalSteps={9}
        onPrev={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
        onNext={() => setCurrentStep((prev) => Math.min(9, prev + 1))}
        onSave={triggerSaveNotification}
        isSavedNotification={isSavedNotification}
      />

      {/* Modals */}
      <SavedPlansModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        plans={savedPlansList}
        currentPlanId={plan.id}
        onSelectPlan={handleSelectPlanFromModal}
        onDuplicatePlan={handleDuplicatePlanFromModal}
        onDeletePlan={handleDeletePlanFromModal}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Weekly Temporary Plan configuration and print Modal (⚙️) */}
      {isWeeklyTempModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:static print:z-auto">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-y-auto flex flex-col p-4 sm:p-6 relative print:border-0 print:shadow-none print:p-0 print:max-h-none print:w-auto print:static print:overflow-visible">
            {/* Modal Close Button (Floating in top right for non-print) */}
            <div className="absolute top-4 right-4 z-10 print:hidden">
              <button
                type="button"
                onClick={() => setIsWeeklyTempModalOpen(false)}
                className="bg-slate-900/80 hover:bg-slate-900 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-lg transition shadow-md flex items-center justify-center gap-1 hover:scale-102 duration-200"
                title="閉じる"
              >
                <span>✕ 閉じる</span>
              </button>
            </div>
            
            <WeeklyTemporaryVersion
              plan={plan}
              onUpdatePlan={(updated) => setPlan(updated)}
              onClose={() => setIsWeeklyTempModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
