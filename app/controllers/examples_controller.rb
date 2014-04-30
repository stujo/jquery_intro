class ExamplesController < ApplicationController
  before_action :example, :only => [:show]

  def show

  end


  def create
    chapter.examples.create(example_params)
    redirect_to chapter
  end

  private

  def chapter
    @chapter ||= Chapter.find params[:chapter_id]
  end

  def example
    @example ||= Example.find params[:id]
    @example = nil if @example.chapter_id != chapter.id
  end

  def example_params
    params.require(:example).permit(:name)
  end

end
