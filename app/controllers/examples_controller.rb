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
    load_example
    unless @example.nil?
      @example_js = load_sample_file(@example.example_js_file_path)
      @example_html =load_sample_file(@example.example_html_file_path)
    end
  end

  private
  def load_sample_file filename
    begin
      sample = File.read(filename)
      sample = sample.strip unless sample.nil?
      sample = nil if sample == ""
    rescue
      sample = nil
    end
    sample
  end

  def example_params
    params.require(:example).permit(:name)
  end

  def load_example
    @example ||= Example.find params[:id]
    if @example.chapter_id != chapter.id
      @example = nil
    end
  end

end
