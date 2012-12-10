Weather::Application.routes.draw do
  resource :map, only: :show
  resources :locations, only: :index
  resources :observations, only: :index

  root to: 'maps#show'
end
