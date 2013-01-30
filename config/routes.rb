Weather::Application.routes.draw do
  resource :map, only: :show
  resources :locations, only: :index
  resources :observations, only: :index

  match '/:year/:month/:day/:hour::minutes' => 'maps#show', via: :get, constraints: StartDateConstraint.new

  root to: 'maps#show'
end
