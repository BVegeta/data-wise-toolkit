import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DataFrame } from 'danfo';
import { DataProfile, DataPipelineStep, UserSession } from '@/types';

interface DataState {
  // Authentication
  isAuthenticated: boolean;
  currentUser: string | null;
  
  // Data
  originalData: DataFrame | null;
  currentData: DataFrame | null;
  dataProfile: DataProfile[];
  
  // Pipeline
  pipeline: DataPipelineStep[];
  currentStep: number;
  
  // Sessions
  sessions: UserSession[];
  currentSession: string | null;
  
  // UI State
  activeTab: 'upload' | 'clean' | 'analyze' | 'pipeline' | 'export';
  isDarkMode: boolean;
  
  // Actions
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setOriginalData: (data: DataFrame) => void;
  setCurrentData: (data: DataFrame) => void;
  setDataProfile: (profile: DataProfile[]) => void;
  addPipelineStep: (step: DataPipelineStep) => void;
  removePipelineStep: (stepId: string) => void;
  setActiveTab: (tab: 'upload' | 'clean' | 'analyze' | 'pipeline' | 'export') => void;
  toggleDarkMode: () => void;
  saveSession: (name: string) => void;
  loadSession: (sessionId: string) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      currentUser: null,
      originalData: null,
      currentData: null,
      dataProfile: [],
      pipeline: [],
      currentStep: 0,
      sessions: [],
      currentSession: null,
      activeTab: 'upload',
      isDarkMode: false,
      
      // Actions
      login: (email: string, password: string) => {
        // Demo login
        if (email === 'demo@app.com' && password === '123456') {
          set({ isAuthenticated: true, currentUser: email });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ 
          isAuthenticated: false, 
          currentUser: null,
          originalData: null,
          currentData: null,
          dataProfile: [],
          pipeline: [],
          currentStep: 0
        });
      },
      
      setOriginalData: (data: DataFrame) => {
        set({ originalData: data, currentData: data });
      },
      
      setCurrentData: (data: DataFrame) => {
        set({ currentData: data });
      },
      
      setDataProfile: (profile: DataProfile[]) => {
        set({ dataProfile: profile });
      },
      
      addPipelineStep: (step: DataPipelineStep) => {
        const { pipeline } = get();
        set({ pipeline: [...pipeline, step] });
      },
      
      removePipelineStep: (stepId: string) => {
        const { pipeline } = get();
        set({ pipeline: pipeline.filter(step => step.id !== stepId) });
      },
      
      setActiveTab: (tab) => {
        set({ activeTab: tab });
      },
      
      toggleDarkMode: () => {
        set({ isDarkMode: !get().isDarkMode });
      },
      
      saveSession: (name: string) => {
        const { pipeline, dataProfile, sessions } = get();
        const newSession: UserSession = {
          id: Date.now().toString(),
          name,
          createdAt: new Date(),
          updatedAt: new Date(),
          pipeline,
          dataProfile
        };
        set({ sessions: [...sessions, newSession], currentSession: newSession.id });
      },
      
      loadSession: (sessionId: string) => {
        const { sessions } = get();
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
          set({ 
            pipeline: session.pipeline,
            dataProfile: session.dataProfile || [],
            currentSession: sessionId
          });
        }
      }
    }),
    {
      name: 'data-cleaning-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        isDarkMode: state.isDarkMode,
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser
      })
    }
  )
);