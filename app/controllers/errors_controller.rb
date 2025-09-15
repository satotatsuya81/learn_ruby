class ErrorsController < ApplicationController
  def not_found
    respond_to do |format|
      format.html { render status: 404 }
      format.json { render json: { error: "Not Found" }, status: 404 }
    end
  end

  def internal_server_error
    respond_to do |format|
      format.html { render status: 500 }
      format.json { render json: { error: "Internal Server Error" }, status: 500 }
    end
  end
end
