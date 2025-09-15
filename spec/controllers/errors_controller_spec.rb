require 'rails_helper'

RSpec.describe ErrorsController, type: :controller do
  describe "GET #not_found" do
    it "returns http status 404" do
      get :not_found
      expect(response).to have_http_status(404)
    end

    it "renders the not_found template" do
      get :not_found
      expect(response).to render_template(:not_found)
    end

    context "when requesting JSON format" do
      it "returns JSON error response" do
        get :not_found, format: :json
        expect(response).to have_http_status(404)
        expect(JSON.parse(response.body)).to eq({ "error" => "Not Found" })
      end
    end
  end

  describe "GET #internal_server_error" do
    it "returns http status 500" do
      get :internal_server_error
      expect(response).to have_http_status(500)
    end

    it "renders the internal_server_error template" do
      get :internal_server_error
      expect(response).to render_template(:internal_server_error)
    end

    context "when requesting JSON format" do
      it "returns JSON error response" do
        get :internal_server_error, format: :json
        expect(response).to have_http_status(500)
        expect(JSON.parse(response.body)).to eq({ "error" => "Internal Server Error" })
      end
    end
  end
end
